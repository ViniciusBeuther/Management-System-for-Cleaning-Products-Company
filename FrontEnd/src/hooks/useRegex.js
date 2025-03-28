const useRegEx = ( { content, regexPattern } ) => {
  if(content.match(regexPattern)) {
    return true;
  }
  return false;
};

export default useRegEx;