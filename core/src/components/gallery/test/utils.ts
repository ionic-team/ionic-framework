export const sharedStyles = `
  ion-gallery {
    width: 343px;
  }

  div {
    color: #fff;
    height: 150px;
  }

  div:nth-child(1) {
    background: #ff6b6b;
  }

  div:nth-child(2) {
    background: #4ecdc4;
  }

  div:nth-child(3) {
    background: #ffe66d;
    color: #333;
  }

  div:nth-child(4) {
    background: #5f27cd;
  }

  div:nth-child(5) {
    background: #7f8c8d;
  }

  div:nth-child(6) {
    background: #ff9f43;
  }

  div:nth-child(7) {
    background: #ff3f34;
  }

  div:nth-child(8) {
    background: #2ecc71;
  }

  div:nth-child(9) {
    background: #34495e;
  }

  div:nth-child(10) {
    background: #1abc9c;
  }

  div:nth-child(11) {
    background: #e67e22;
  }

  div:nth-child(12) {
    background: #9b59b6;
  }
`;

export const numberToWords = (value: number): string => {
  const ones = [
    'zero',
    'one',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
    'eight',
    'nine',
    'ten',
    'eleven',
    'twelve',
    'thirteen',
    'fourteen',
    'fifteen',
    'sixteen',
    'seventeen',
    'eighteen',
    'nineteen',
  ];
  const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

  if (!Number.isInteger(value) || value < 0 || value >= 100) {
    return `${value}`;
  }

  let word = '';
  if (value < 20) {
    word = ones[value];
  } else {
    const tensValue = Math.floor(value / 10);
    const onesValue = value % 10;
    word = onesValue === 0 ? tens[tensValue] : `${tens[tensValue]}-${ones[onesValue]}`;
  }

  return word.charAt(0).toUpperCase() + word.slice(1);
};
