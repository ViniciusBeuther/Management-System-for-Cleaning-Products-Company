const useRegEx = ( { content, regexPattern } ) => {
  // console.log(`${content}-${regexPattern}`)
  
  if (typeof content === 'string' && content.match(regexPattern)) {
    return true;
  }
  return false;
};

export default useRegEx;