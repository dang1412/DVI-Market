import { useEffect, useState } from 'react'

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { getItemInfo, SaleItem, nativeBuyItem } from '../../data'

export enum CardStatus {
  Selling,
  Sold,
  Owned
}

interface Props {
  token: SaleItem
  paused: boolean
  status: CardStatus
}

export const LandSaleCard: React.FC<Props> = ({ token, paused, status }) => {
  const [info, setInfo] = useState(token.info)

  const buy = () => {
    if (token.type === 0) {
      nativeBuyItem(token.id, token.price)
    }
  }

  useEffect(() => {
    (async () => {
      const _info = await getItemInfo(token.id)
      setInfo(_info)
    })()
  }, [token.id])

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
          Id: {token.id}, Price: {token.price} <br/>
          {info ? `(${info?.startX},${info?.startY}) ~ (${info?.endX},${info?.endY})` : ''}
        </Typography>
      </CardContent>
      <CardActions>
        {status === CardStatus.Selling ?
        <Button size="small" variant='contained' onClick={buy} color={paused ? 'error' : 'success'}>Buy</Button>
        : status === CardStatus.Sold ? 'Sold' : 'Owned'
        }
      </CardActions>
    </Card>
  )
}
