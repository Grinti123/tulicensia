export const fadeIn = (element: HTMLElement, duration = 500): void => {
  element.style.opacity = '0';
  element.style.transition = `opacity ${duration}ms ease-in-out`;

  // Trigger reflow
  element.offsetHeight;

  element.style.opacity = '1';
};

export const fadeOut = (element: HTMLElement, duration = 500): Promise<void> => {
  return new Promise((resolve) => {
    element.style.opacity = '1';
    element.style.transition = `opacity ${duration}ms ease-in-out`;

    // Trigger reflow
    element.offsetHeight;

    element.style.opacity = '0';

    setTimeout(() => {
      resolve();
    }, duration);
  });
};

export const slideIn = (element: HTMLElement, direction: 'up' | 'down' | 'left' | 'right' = 'up', duration = 500): void => {
  const transformMap = {
    up: 'translateY(50px)',
    down: 'translateY(-50px)',
    left: 'translateX(50px)',
    right: 'translateX(-50px)',
  };

  element.style.transform = transformMap[direction];
  element.style.transition = `transform ${duration}ms ease-out`;

  // Trigger reflow
  element.offsetHeight;

  element.style.transform = 'translate(0)';
};

export const createIntersectionObserver = (
  element: HTMLElement,
  callback: (entry: IntersectionObserverEntry) => void,
  options: IntersectionObserverInit = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
  }
): IntersectionObserver => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(callback);
  }, options);

  observer.observe(element);
  return observer;
};
