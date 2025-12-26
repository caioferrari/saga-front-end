class KnowledgeBaseManager {
  constructor(supabaseClient) {
    this.supabase = supabaseClient;
  }

  async addArticle(data) {
    const { title, question, answer, category = 'General', tags = [] } = data;

    if (!title || !question || !answer) {
      throw new Error('Title, question, and answer are required');
    }

    const { data: result, error } = await this.supabase
      .from('knowledge_base')
      .insert([
        {
          title,
          question,
          answer,
          category,
          tags
        }
      ])
      .select();

    if (error) {
      console.error('Error adding article:', error);
      throw error;
    }

    return result[0];
  }

  async updateArticle(id, updates) {
    const { data, error } = await this.supabase
      .from('knowledge_base')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error updating article:', error);
      throw error;
    }

    return data[0];
  }

  async deleteArticle(id) {
    const { error } = await this.supabase
      .from('knowledge_base')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting article:', error);
      throw error;
    }

    return true;
  }

  async getAllArticles(category = null) {
    let query = this.supabase
      .from('knowledge_base')
      .select('*')
      .order('created_at', { ascending: false });

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching articles:', error);
      throw error;
    }

    return data;
  }

  async searchArticles(searchTerm) {
    const { data, error } = await this.supabase
      .from('knowledge_base')
      .select('*')
      .or(`title.ilike.%${searchTerm}%,question.ilike.%${searchTerm}%,answer.ilike.%${searchTerm}%`)
      .limit(10);

    if (error) {
      console.error('Error searching articles:', error);
      throw error;
    }

    return data;
  }

  async getCategories() {
    const { data, error } = await this.supabase
      .from('knowledge_base')
      .select('category')
      .order('category');

    if (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }

    const categories = [...new Set(data.map(item => item.category))];
    return categories;
  }

  async getArticlesByTag(tag) {
    const { data, error } = await this.supabase
      .from('knowledge_base')
      .select('*')
      .contains('tags', [tag]);

    if (error) {
      console.error('Error fetching articles by tag:', error);
      throw error;
    }

    return data;
  }

  async importBulk(articles) {
    const { data, error } = await this.supabase
      .from('knowledge_base')
      .insert(articles)
      .select();

    if (error) {
      console.error('Error importing articles:', error);
      throw error;
    }

    return data;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = KnowledgeBaseManager;
}
