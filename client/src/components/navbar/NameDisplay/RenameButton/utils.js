export const getRenameButtonStyle = (isDarkMode) => {
  return (
    {
      '&:hover': {
        backgroundColor: isDarkMode ? '#d81a609c' : '#d81a6073',
      },
      '&:hover > svg': {
        fill: isDarkMode ? '#b1a9a9' : '#393939'
      }
    }
  );
};