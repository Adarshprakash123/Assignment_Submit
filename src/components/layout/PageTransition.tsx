
import React from 'react';
import { useLocation } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation();
  
  return (
    <TransitionGroup className="relative w-full">
      <CSSTransition
        key={location.pathname}
        timeout={300}
        classNames="page-transition"
        unmountOnExit
      >
        <div className="w-full">
          {children}
        </div>
      </CSSTransition>
    </TransitionGroup>
  );
};

export default PageTransition;
