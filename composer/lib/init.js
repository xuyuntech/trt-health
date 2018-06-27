'use strict';
/**
 * Track the trade of a commodity from one trader to another
 * @param {org.xuyuntech.health.InitData} tx - init data
 * @transaction
 */
async function initData(tx) {
  const hospitals = [
    {
      name: '北京同仁堂唐山中医医院',
      address: '唐山市路北区河东路三益楼5-12号',
      phone1: '0575',
      phone2: '5918781',
      zipCode: '1000000',
      headImg: 'http://img.yzcdn.cn/upload_files/2018/06/22/FjZ-FCkMjTt03zswL6gpjw3MohNP.png',
    }
  ];
  const doctors = [
    {
      name: '王志国',
      phone: '18699880099',
      sid: '57839393938484040293',
      email: '',
      address: '',
      birthday: '',
      avatar: 'http://www.jf258.com/uploads/2013-12-31/020200285.jpg',
      gender: 'MALE',
      age: 40,
      title: '主任医师',
      description: '北京专家，医学博士，博士后，研究员，现任职于中国中医科学院',
      skilledIn: '治疗内科、妇科以及外科等疾病',
    },
    {
      name: '路广林',
      phone: '18699880099',
      sid: '57839393938484012333',
      email: '',
      address: '',
      birthday: '',
      avatar: 'http://www.jf258.com/uploads/2013-12-31/020200285.jpg',
      gender: 'FEMALE',
      age: 45,
      title: '主任医师',
      description: '北京专家，医学博士，教授，毕业于北京中医药大学',
      skilledIn: '内科，妇科，皮外科，儿科',
    }
  ];
  let hospitalRegistry = await getAssetRegistry('org.xuyuntech.health.Hospital');
  await hospitalRegistry.add();
}