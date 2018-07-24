function getRandomaInt() {
  return Math.floor(Math.random() * 9);
}

export default function setCodes() {
  const codes = [];
  for (let index = 0; index < 6; index += 1) {
    codes.push(getRandomaInt());
  }

  const code = codes.join('');
  return code;
}

// export function verifyCodes(codesGet, codesSet) {
//   if (codesGet !== codesSet) {
//     console.log('校验失败，验证码错误');
//   } else {
//     console.log('校验成功');
//   }
// }
