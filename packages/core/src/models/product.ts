import { Column } from 'typeorm';

export class Product {
  @Column()
  productId: string;

  @Column()
  name: string;

  @Column()
  product_desc: string;

  @Column()
  price: number;

  @Column()
  link: string;

  @Column()
  image: string;

  @Column()
  retailer?: string;
}
