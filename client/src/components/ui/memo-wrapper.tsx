import React, { memo, ComponentType } from 'react';

/**
 * HOC that wraps a component with React.memo for performance optimization
 * 
 * @param Component - The component to be memoized
 * @param displayName - Optional display name for the memoized component
 * @returns Memoized component
 */
export function withMemo<P extends object>(
  Component: ComponentType<P>,
  displayName?: string
): React.MemoExoticComponent<ComponentType<P>> {
  const MemoizedComponent = memo(Component);
  
  if (displayName) {
    MemoizedComponent.displayName = displayName;
  } else if (Component.displayName || Component.name) {
    MemoizedComponent.displayName = `Memo(${Component.displayName || Component.name})`;
  }
  
  return MemoizedComponent;
}

/**
 * Type for components that can be wrapped with MemoWrapper
 */
type MemoWrapperProps = {
  component: React.ComponentType<any>;
  props: any;
  displayName?: string;
};

/**
 * Component that wraps another component with React.memo
 * Useful when you need to memoize components dynamically
 */
export const MemoWrapper: React.FC<MemoWrapperProps> = ({
  component: Component,
  props,
  displayName,
}) => {
  const MemoizedComponent = React.useMemo(
    () => withMemo(Component, displayName),
    [Component, displayName]
  );

  return <MemoizedComponent {...props} />;
};

export default withMemo;