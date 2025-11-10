// Sistema de armazenamento de produtos no localStorage

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string[]; // Até 3 imagens
  category?: string;
  merchantId: string;
}

const STORAGE_KEY = 'agreste_products';

export const ProductStorage = {
  // Buscar todos os produtos
  getAll(): Product[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  // Buscar produtos de um lojista específico
  getByMerchant(merchantId: string): Product[] {
    return this.getAll().filter(p => p.merchantId === merchantId);
  },

  // Adicionar produto
  add(product: Omit<Product, 'id'>): Product {
    const products = this.getAll();
    const newProduct = {
      ...product,
      id: Date.now(),
    };
    products.push(newProduct);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    return newProduct;
  },

  // Atualizar produto
  update(id: number, updates: Partial<Product>): void {
    const products = this.getAll();
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
      products[index] = { ...products[index], ...updates };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    }
  },

  // Deletar produto
  delete(id: number): void {
    const products = this.getAll().filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  },

  // Inicializar produtos padrão para um lojista
  initDefaultProducts(merchantId: string): void {
    const existing = this.getByMerchant(merchantId);
    if (existing.length === 0) {
      const defaultProducts = [
        {
          merchantId,
          name: "Camisa Polo Masculina",
          description: "Camisa polo de alta qualidade, 100% algodão",
          price: 89.90,
          stock: 25,
          images: ["https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400&q=80"],
          category: "Masculino"
        },
        {
          merchantId,
          name: "Vestido Floral Feminino",
          description: "Vestido leve e confortável, perfeito para o verão",
          price: 129.90,
          stock: 15,
          images: ["https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&q=80"],
          category: "Feminino"
        },
      ];

      defaultProducts.forEach(p => this.add(p));
    }
  }
};
