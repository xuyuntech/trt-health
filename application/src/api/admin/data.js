/* eslint-disable */
var doctors = require('./doctors');

module.exports = {
  hospitals: [
    {
      name: '北京同仁堂唐山中医医院',
      address: '唐山市路北区河东路三益楼5-12号',
      province: '河北省',
      city: '唐山市',
      area: '路北区',
      grade: 'FirstA',
      phone1: '0575',
      phone2: '5918781',
      location: {
        lng: '118.200640',
        lat: '39.660550',
      },
      departments: ['中医', '中医妇科', '针灸理疗科', '简易门诊', '慢病门诊', '综合病房'],
    },
  ],
  // doctor[hospital, departments]
  doctors: doctors,
};
