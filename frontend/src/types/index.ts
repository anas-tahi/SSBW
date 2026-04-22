export interface Product {
  id: number;
  título: string;
  descripción: string;
  precio: number;
  imagen: string;
  categoria: string;
}

export interface CartItem extends Product {
  cantidad: number;
}

export interface User {
  email: string;
  nombre: string;
  admin: boolean;
}
