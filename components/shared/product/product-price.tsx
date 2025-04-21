import { cn } from '@/lib/utils'

const ProductPrice = ({
  value,
  classname
}: {
  value: number
  classname?: string
}) => {
  const stringValue = value.toFixed(2)

  const [intValue, floatValue] = stringValue.split('.')
  return (
    <p className={cn('text-2xl', classname)}>
      <span className='align-super text-xs'>$</span>
      {intValue}
      <span className='text-xs align-super'>{floatValue}</span>
    </p>
  )
}

export default ProductPrice
