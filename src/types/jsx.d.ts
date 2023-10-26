declare interface ComponentProps {
  children: Array<Component>;
  style: React.CSSProperties;
  className: string;
  id: string;
}

export type Component = Function | HTMLElement;
