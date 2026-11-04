import { useApp } from '../context/AppContext'
import Icon from './Icon'

export default function Toast() {
  const { toast } = useApp()
  return (
    <div className={`toast${toast.show ? ' show' : ''}`} id="toast">
      <Icon name="info" size="sm" stroke="#ffffff" />
      <span>{toast.message}</span>
    </div>
  )
}
