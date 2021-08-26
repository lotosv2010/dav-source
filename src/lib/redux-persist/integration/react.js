import React, { useEffect } from 'react';

function PersistGate({persistor = {}, children}) {
  useEffect(() => {
    persistor.initialize();
  }, [persistor])

  return <>{children}</>
}
export {
  PersistGate
}