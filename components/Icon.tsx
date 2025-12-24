import * as icons from 'lucide-react-native';

interface IconProps {
  name: keyof typeof icons;
  color?: string;
  size?: number;
}

const Icon = ({ name, color, size }: IconProps) => {
  return <icons.Component[name] color={color} size={size} />;
};

export default Icon;