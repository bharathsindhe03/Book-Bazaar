export interface CartItem {
  book_id: number;
  title: string;
  author: string;
  price: number;
  image: string; // Assuming image is a base64 string
  quantity: number;
}