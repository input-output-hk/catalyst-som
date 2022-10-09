import { NotificationProgrammatic } from '@oruga-ui/oruga-next'

const notification = (msg, notificationType) => {
  NotificationProgrammatic.open({
    message: msg,
    variant: notificationType,
    closable: true,
    duration: 5000,
    position: 'bottom-right'
  })
}

const errorNotification = (msg) => {
  notification(msg, 'danger')
}

const successNotification = (msg) => {
  notification(msg, 'success')
}

export { errorNotification, successNotification }
