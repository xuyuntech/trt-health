trt-health
---

Role
组织管理员 -> 医院管理员
              -> 

participant
O 组织管理员
Y 医师
Y 患者
o 供应商
X 医院管理员

asset
Y 医院
Y 排班记录
Y 挂号单
Y 一级科室
Y 二级科室
Y 药品
Y 病例
Y 处方
Y 订单，订单明细
X 出库记录
X 支付记录

transaction
Y 挂号
Y 核销挂号单
X 支付挂号费
X 支付订单
Y 完成挂号单（开处方）
X 药品出库