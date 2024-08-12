import AspectRatio from '@mui/joy/AspectRatio';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Typography from '@mui/joy/Typography';

interface Card{
    link: string;
    price: string;
    title: string;
    brand: string;
    img: string;
}

export default function BasicCard({link,price,title,brand,img}: Card) {
  return (
    <Card sx={{ width: 320 }}>
      <div>
        <Typography level="title-lg">{title}</Typography>
        <Typography level="body-sm">{brand}</Typography>
      </div>
      <AspectRatio minHeight="300px" maxHeight="350px">
        <img
          src={img}
          srcSet="https://images.unsplash.com/photo-1527549993586-dff825b37782?auto=format&fit=crop&w=286&dpr=2 2x"
          loading="lazy"
          alt=""
        />
      </AspectRatio>
      <CardContent orientation="horizontal">
        <div>
          <Typography level="body-xs">Total price:</Typography>
          <Typography fontSize="lg" fontWeight="lg">{price}</Typography>
        </div>
        <Button
          variant="solid"
          size="md"
          color="primary"
          onClick={() => window.open(`${link}`)}
          aria-label="Explore Bahamas Islands"
          sx={{ ml: 'auto', alignSelf: 'center', fontWeight: 600 }}
        >
          Open
        </Button>
      </CardContent>
    </Card>
  );
}
