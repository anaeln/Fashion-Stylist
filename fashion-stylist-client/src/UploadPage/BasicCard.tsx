import { useState, useEffect } from 'react';
import { Card, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

interface CardProps {
  id: string;
  link: string;
  price: string;
  title: string;
  brand: string;
  img: string;
  isHeartFull: boolean;
  onHeartChange?: () => void;
  isUserConnected: boolean;
}

export default function BasicCard({ id, link, price, title, brand, img, isHeartFull, onHeartChange, isUserConnected }: CardProps) {
  const [isHeartFilled, setIsHeartFilled] = useState(false);

  // Reset heart state when `isHeartFull` prop changes (i.e., when switching recommendations)
  useEffect(() => {
    setIsHeartFilled(isHeartFull);
  }, [isHeartFull]);

  const handleHeartClick = async (item: any, isFull: boolean) => {
    try {
      const response = await axios.post(
        'http://localhost:5000/updateFavorites',
        { ...item, isFull },
        { withCredentials: true }
      );
      console.log(response.data.message);

      if (onHeartChange) {
        onHeartChange();
      }
    } catch (error) {
      console.error('Error updating favorites:', error);
    }
  };

  const toggleHeartImage = async () => {
    const newHeartState = !isHeartFilled;
    setIsHeartFilled(newHeartState);
    await handleHeartClick({ id, link, price, title, brand, img }, newHeartState);
  };

  return (
    <Card style={{ width: '320px', height: '450px', display: 'flex', flexDirection: 'column', padding: '0'}} key={title}>
      <Card.Img variant="top" src={img} alt={title} style={{ height: '250px', objectFit: 'cover' }} />
      <Card.Body className="d-flex flex-column" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', padding: '10px 40px' }}>
        <div>
          <Card.Title>{title}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">{brand}</Card.Subtitle>
        </div>
        <div className="mt-auto">
          <Card.Text style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
            {price}
          </Card.Text>
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id="tooltip-top">Add to favorites</Tooltip>}
          >
            <Button
              onClick={toggleHeartImage}
              style={{
                position: 'absolute',
                left: '15px',
                bottom: '15px',
                width: '30px',
                height: '30px',
                border: 'none',
                background: `url(${isUserConnected && isHeartFilled ? 'http://localhost:5000/public/fullHeart.png' : 'http://localhost:5000/public/hollowHeart.png'})`,
              }}
            />
          </OverlayTrigger>
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id="tooltip-top">terminalx.com</Tooltip>}
          >
            <Button
              variant="primary"
              onClick={() => window.open(link, '_blank')}
              style={{ width: '70px', marginTop: '15px' }}
            >
              Open
            </Button>
          </OverlayTrigger>
        </div>
      </Card.Body>
    </Card>
  );
}
