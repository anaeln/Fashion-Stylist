import { Card, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

interface CardProps {
  link: string;
  price: string;
  title: string;
  brand: string;
  img: string;
}

export default function BasicCard({ link, price, title, brand, img }: CardProps) {
  return (
    <Card style={{ width: '20rem' }} key={title}>
      <Card.Img variant="top" src={img} alt={title} style={{ height: '200px', objectFit: 'cover' }} />
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{brand}</Card.Subtitle>
        <Card.Text>
          Total price: {price}
        </Card.Text>
        <Button variant="primary" onClick={() => window.open(`${link}`)}>
          Open
        </Button>
      </Card.Body>
    </Card>
  );
}
