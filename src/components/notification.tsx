import { Alert } from '@heroui/alert';

export enum NotificationType {
  default = "default",
  primary = "primary",
  secondary = "secondary",
  success = "success",
  warning = "warning",
  danger = "danger",
}

export default function Notification(props: {
  notificationType: NotificationType;
}) {
  return (
    <div className="absolute top-16 right-16 transition-all duration-500 delay-150 ease-in-out translate-x-full overflow-hidden">
      <Alert
        color={props.notificationType}
        title={`This is a ${props.notificationType} alert`}
      />
    </div>
  );
}
