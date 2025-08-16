/**
 * Documents API - Edge Function for D1 Database
 * Handles CRUD operations for telecom security documents
 */

export async function onRequest(context) {
  const { request, env } = context;
  const { pathname, searchParams } = new URL(request.url);
  
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const path = pathname.replace('/api/documents', '');
    
    switch (request.method) {
      case 'GET':
        return await handleGet(path, searchParams, env, corsHeaders);
      case 'POST':
        return await handlePost(request, env, corsHeaders);
      case 'PUT':
        return await handlePut(path, request, env, corsHeaders);
      case 'DELETE':
        return await handleDelete(path, env, corsHeaders);
      default:
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
          status: 405,
          headers: corsHeaders,
        });
    }
  } catch (error) {
    console.error('API Error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      message: error.message 
    }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}

/**
 * Handle GET requests for documents
 */
async function handleGet(path, searchParams, env, corsHeaders) {
  const { DB } = env;
  
  if (path === '' || path === '/') {
    // List documents with pagination and filtering
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = Math.min(parseInt(searchParams.get('limit')) || 20, 100);
    const offset = (page - 1) * limit;
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const status = searchParams.get('status') || 'published';
    
    let query = `
      SELECT d.*, c.name as category_name, u.username as author_name,
             u.full_name as author_full_name
      FROM documents d
      JOIN categories c ON d.category_id = c.id
      JOIN users u ON d.author_id = u.id
      WHERE d.status = ?
    `;
    let params = [status];
    
    if (category) {
      query += ' AND d.category_id = ?';
      params.push(category);
    }
    
    if (search) {
      query += ' AND (d.title LIKE ? OR d.abstract LIKE ? OR d.keywords LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }
    
    query += ' ORDER BY d.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);
    
    const documents = await DB.prepare(query).bind(...params).all();
    
    // Get total count for pagination
    let countQuery = `
      SELECT COUNT(*) as total
      FROM documents d
      WHERE d.status = ?
    `;
    let countParams = [status];
    
    if (category) {
      countQuery += ' AND d.category_id = ?';
      countParams.push(category);
    }
    
    if (search) {
      countQuery += ' AND (d.title LIKE ? OR d.abstract LIKE ? OR d.keywords LIKE ?)';
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm, searchTerm);
    }
    
    const countResult = await DB.prepare(countQuery).bind(...countParams).first();
    const total = countResult.total;
    
    return new Response(JSON.stringify({
      documents: documents.results,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    }), { headers: corsHeaders });
    
  } else {
    // Get specific document by slug
    const slug = path.substring(1);
    
    const document = await DB.prepare(`
      SELECT d.*, c.name as category_name, c.slug as category_slug,
             u.username as author_name, u.full_name as author_full_name,
             u.avatar_url as author_avatar
      FROM documents d
      JOIN categories c ON d.category_id = c.id
      JOIN users u ON d.author_id = u.id
      WHERE d.slug = ? AND d.status = 'published'
    `).bind(slug).first();
    
    if (!document) {
      return new Response(JSON.stringify({ error: 'Document not found' }), {
        status: 404,
        headers: corsHeaders,
      });
    }
    
    // Increment view count
    await DB.prepare(`
      UPDATE documents 
      SET view_count = view_count + 1 
      WHERE id = ?
    `).bind(document.id).run();
    
    // Get related documents
    const relatedDocs = await DB.prepare(`
      SELECT id, title, slug, abstract, category_id
      FROM documents
      WHERE category_id = ? AND id != ? AND status = 'published'
      ORDER BY created_at DESC
      LIMIT 5
    `).bind(document.category_id, document.id).all();
    
    // Get document tags
    const tags = await DB.prepare(`
      SELECT t.*
      FROM tags t
      JOIN document_tags dt ON t.id = dt.tag_id
      WHERE dt.document_id = ?
      ORDER BY t.name
    `).bind(document.id).all();
    
    return new Response(JSON.stringify({
      document: {
        ...document,
        related_documents: relatedDocs.results,
        tags: tags.results,
      },
    }), { headers: corsHeaders });
  }
}

/**
 * Handle POST requests to create new documents
 */
async function handlePost(request, env, corsHeaders) {
  const { DB } = env;
  const body = await request.json();
  
  // Validate required fields
  const required = ['title', 'abstract', 'category_id', 'author_id'];
  for (const field of required) {
    if (!body[field]) {
      return new Response(JSON.stringify({ 
        error: `Missing required field: ${field}` 
      }), {
        status: 400,
        headers: corsHeaders,
      });
    }
  }
  
  // Generate slug from title
  const slug = generateSlug(body.title);
  
  // Check if slug already exists
  const existing = await DB.prepare(`
    SELECT id FROM documents WHERE slug = ?
  `).bind(slug).first();
  
  if (existing) {
    return new Response(JSON.stringify({ 
      error: 'Document with this title already exists' 
    }), {
      status: 409,
      headers: corsHeaders,
    });
  }
  
  // Insert new document
  const result = await DB.prepare(`
    INSERT INTO documents (
      id, title, slug, abstract, content, category_id, author_id,
      tags, keywords, source, license, status, published_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    generateId(),
    body.title,
    slug,
    body.abstract,
    body.content || '',
    body.category_id,
    body.author_id,
    JSON.stringify(body.tags || []),
    JSON.stringify(body.keywords || []),
    body.source || '',
    body.license || 'Creative Commons Attribution 4.0 International',
    body.status || 'draft',
    body.status === 'published' ? new Date().toISOString() : null
  ).run();
  
  // Get the created document
  const document = await DB.prepare(`
    SELECT d.*, c.name as category_name, u.username as author_name
    FROM documents d
    JOIN categories c ON d.category_id = c.id
    JOIN users u ON d.author_id = u.id
    WHERE d.id = ?
  `).bind(result.meta.last_row_id).first();
  
  return new Response(JSON.stringify({
    message: 'Document created successfully',
    document,
  }), { 
    status: 201,
    headers: corsHeaders,
  });
}

/**
 * Handle PUT requests to update documents
 */
async function handlePut(path, request, env, corsHeaders) {
  const { DB } = env;
  const body = await request.json();
  const documentId = path.substring(1);
  
  // Check if document exists
  const existing = await DB.prepare(`
    SELECT id, author_id FROM documents WHERE id = ?
  `).bind(documentId).first();
  
  if (!existing) {
    return new Response(JSON.stringify({ error: 'Document not found' }), {
      status: 404,
      headers: corsHeaders,
    });
  }
  
  // Update document
  const updateFields = [];
  const params = [];
  
  if (body.title) {
    updateFields.push('title = ?');
    params.push(body.title);
  }
  if (body.abstract) {
    updateFields.push('abstract = ?');
    params.push(body.abstract);
  }
  if (body.content !== undefined) {
    updateFields.push('content = ?');
    params.push(body.content);
  }
  if (body.category_id) {
    updateFields.push('category_id = ?');
    params.push(body.category_id);
  }
  if (body.tags) {
    updateFields.push('tags = ?');
    params.push(JSON.stringify(body.tags));
  }
  if (body.keywords) {
    updateFields.push('keywords = ?');
    params.push(JSON.stringify(body.keywords));
  }
  if (body.status) {
    updateFields.push('status = ?');
    params.push(body.status);
    if (body.status === 'published') {
      updateFields.push('published_at = ?');
      params.push(new Date().toISOString());
    }
  }
  
  if (updateFields.length === 0) {
    return new Response(JSON.stringify({ error: 'No fields to update' }), {
      status: 400,
      headers: corsHeaders,
    });
  }
  
  updateFields.push('updated_at = ?');
  params.push(new Date().toISOString());
  params.push(documentId);
  
  await DB.prepare(`
    UPDATE documents 
    SET ${updateFields.join(', ')}
    WHERE id = ?
  `).bind(...params).run();
  
  // Get updated document
  const document = await DB.prepare(`
    SELECT d.*, c.name as category_name, u.username as author_name
    FROM documents d
    JOIN categories c ON d.category_id = c.id
    JOIN users u ON d.author_id = u.id
    WHERE d.id = ?
  `).bind(documentId).first();
  
  return new Response(JSON.stringify({
    message: 'Document updated successfully',
    document,
  }), { headers: corsHeaders });
}

/**
 * Handle DELETE requests to remove documents
 */
async function handleDelete(path, env, corsHeaders) {
  const { DB } = env;
  const documentId = path.substring(1);
  
  // Check if document exists
  const existing = await DB.prepare(`
    SELECT id FROM documents WHERE id = ?
  `).bind(documentId).first();
  
  if (!existing) {
    return new Response(JSON.stringify({ error: 'Document not found' }), {
      status: 404,
      headers: corsHeaders,
    });
  }
  
  // Soft delete - mark as archived
  await DB.prepare(`
    UPDATE documents 
    SET status = 'archived', updated_at = ?
    WHERE id = ?
  `).bind(new Date().toISOString(), documentId).run();
  
  return new Response(JSON.stringify({
    message: 'Document archived successfully',
  }), { headers: corsHeaders });
}

/**
 * Generate a unique ID for documents
 */
function generateId() {
  return 'doc-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

/**
 * Generate a URL-friendly slug from title
 */
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
}
