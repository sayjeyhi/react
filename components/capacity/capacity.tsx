import React, { useMemo } from 'react'
import withDefaults from '../utils/with-defaults'
import useTheme from '../styles/use-theme'
import { ZeitUIThemesPalette } from '../styles/themes'

interface Props {
  value?: number
  limit?: number
  color?: string
  className?: string
}

const defaultProps = {
  value: 0,
  limit: 100,
  color: '',
  className: '',
}

export type CapacityProps = Props & typeof defaultProps & React.HTMLAttributes<any>

const getColor = (val: number, palette: ZeitUIThemesPalette): string => {
  if (val < 33) return palette.cyan
  if (val < 66) return palette.warning
  return palette.errorDark
}

const Capacity: React.FC<CapacityProps> = React.memo(({
  value, limit, color: userColor, className, ...props
}) => {
  const theme = useTheme()
  const percentValue = useMemo<number>(() => {
    const val = value / limit
    const couldBeDecimalValue = (Number.isNaN(val) ? 0 : val) * 100
    if (couldBeDecimalValue > 100) return 100
    if (couldBeDecimalValue < 0) return 0
    if (!`${couldBeDecimalValue}`.includes('.')) return couldBeDecimalValue
    
    const decimal = `${couldBeDecimalValue}`.split('.')[1]
    if (decimal.length < 2) return couldBeDecimalValue
    
    return +couldBeDecimalValue.toFixed(2)
  }, [value, limit])
  const color = useMemo(() => {
    if (userColor && userColor !== '') return userColor
    return getColor(percentValue, theme.palette)
  }, [userColor, percentValue, theme.palette])
  
  return (
    <div className={`capacity ${className}`} title={`${percentValue}%`} {...props}>
      <span />
      <style jsx>{`
        .capacity {
          width: 50px;
          height: 10px;
          border-radius: ${theme.layout.radius};
          overflow: hidden;
          background-color: ${theme.palette.accents_2};
        }

        span {
          width: ${percentValue}%;
          background-color: ${color};
          height: 100%;
          margin: 0;
          padding: 0;
          display: block;
        }
      `}</style>
    </div>
  )
})

export default withDefaults(Capacity, defaultProps)
