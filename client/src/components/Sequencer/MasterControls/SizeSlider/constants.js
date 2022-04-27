const sizeMarkLabels = {
  four: 2,
  eight: 3,
  sixteen: 4,
  thirtyTwo: 5
};

export const sizeMarks = Object.values(sizeMarkLabels).map(mark => {
  return { value: mark };
});

export const sliderLabelHeader = 'Grid Size';
export const sliderLabelText = '(Beats)';

export const sliderSx = {
  '& .MuiSlider-thumb': {
    height: 20,
    width: 4,
    borderRadius: 0,
  }
};