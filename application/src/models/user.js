import { ROLES } from '../const';

export default class {
  constructor(data) {
    this.data = data;
  }
  isRole(roleName) {
    const { roles } = this.data;
    if (!roles || Array.isArray(roles)) {
      return false;
    }
    return roles.indexOf(roleName) >= 0;
  }
  isAdmin() {
    return this.isRole(ROLES.ADMIN);
  }
  isHospitalAdmin() {
    return this.isRole(ROLES.HOSPITAL_ADMIN);
  }
  isDoctor() {
    return this.isRole(ROLES.DOCTOR);
  }
  isPatient() {
    return this.isRole(ROLES.PATIENT);
  }
}
