import { Column } from "typeorm";

export class Product {
  @Column()
  product_name: string;

  @Column()
  product_desc: string;

  @Column()
  product_price: number;

  @Column()
  product_link: string;

  @Column()
  path: string;
}
