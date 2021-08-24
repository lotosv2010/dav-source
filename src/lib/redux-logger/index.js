const colors = {
  title: () => 'inherit',
  prevState: () => '#9E9E9E',
  action: () => '#03A9F4',
  nextState: () => '#4CAF50',
  error: () => '#F20404'
}

const logger = ({dispatch, getState}) => next => action => {
  const startTime = new Date();
  const prevState = getState();
  next(action);
  const nextState = getState();
  console.group(
    `%caction %c${action.type} %c@ ${startTime.toLocaleTimeString()}`, 
    `color: ${colors.prevState()};font-weight:lighter`,
    `color: ${colors.title()};font-weight:bold`,
    `color: ${colors.prevState()};font-weight:lighter`
  );
  console.log('%cprev state', `color:${colors.prevState()};font-weight:lighter`,prevState);
  console.log('%caction', `color:${colors.action()};font-weight:lighter`, action);
  console.log('%cnext state', `color:${colors.nextState()};font-weight:lighter`, nextState);
  console.groupEnd();
}
export default logger;