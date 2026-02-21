// In-memory needy person storage
class NeedyPerson {
  static needyPeople = [];

  constructor(data) {
    this._id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    this.needyId = data.needyId;
    this.name = data.name;
    this.area = data.area;
    this.category = data.category;
    this.phone = data.phone || '';
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  static async create(data) {
    const person = new NeedyPerson(data);
    this.needyPeople.push(person);
    return person;
  }

  static async insertMany(dataArray) {
    const people = dataArray.map(data => new NeedyPerson(data));
    this.needyPeople.push(...people);
    return people;
  }

  static async find(query = {}) {
    return [...this.needyPeople];
  }

  static async findById(id) {
    return this.needyPeople.find(p => p._id === id || p.needyId === id);
  }

  static async countDocuments(query = {}) {
    return this.needyPeople.length;
  }

  async save() {
    this.updatedAt = new Date();
    return this;
  }
}

module.exports = NeedyPerson;
