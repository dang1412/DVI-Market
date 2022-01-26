import { useEffect, useState } from 'react'

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { getItemInfo, SaleItem, nativeBuyItem } from '../../data'

export const LandSaleCard: React.FC<{ land: SaleItem }> = ({ land }) => {
  const [info, setInfo] = useState(land.info)

  const buy = () => {
    if (land.type === 0) {
      nativeBuyItem(land.id, land.price)
    }
  }

  useEffect(() => {
    (async () => {
      const _info = await getItemInfo(land.id)
      setInfo(_info)
    })()
  }, [land.id])

  return (
    <Card sx={{ maxWidth: 285 }} style={{margin: 5}}>
      <CardMedia
        component="img"
        height="340"
        image={info ? info.image : ''}
        alt="green iguana"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          { info? info.type : '' }
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Id: {land.id}, Price: {land.price} <br/>
          {info ? `(${info?.startX},${info?.startY}) ~ (${info?.endX},${info?.endY})` : ''}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={buy}>Buy</Button>
      </CardActions>
    </Card>
  )
}
