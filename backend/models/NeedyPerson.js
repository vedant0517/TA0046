// In-memory database for needy people
const needyPeople = [
  { id: 'N001', name: 'Ramesh Patil', area: 'Nagpur', category: 'Food', phone: '' },
  { id: 'N002', name: 'Sunita Kale', area: 'Pune', category: 'Clothes', phone: '' },
  { id: 'N003', name: 'Mohan Deshmukh', area: 'Mumbai', category: 'Education', phone: '' },
  { id: 'N004', name: 'Asha Jadhav', area: 'Nashik', category: 'Medical', phone: '' },
  { id: 'N005', name: 'Ravi More', area: 'Aurangabad', category: 'Daily Essentials', phone: '' },
  { id: 'N006', name: 'Pooja Shinde', area: 'Kolhapur', category: 'Food', phone: '' },
  { id: 'N007', name: 'Suresh Pawar', area: 'Solapur', category: 'Clothes', phone: '' },
  { id: 'N008', name: 'Kavita Thakur', area: 'Thane', category: 'Education', phone: '' },
  { id: 'N009', name: 'Anil Pawar', area: 'Amravati', category: 'Medical', phone: '' },
  { id: 'N010', name: 'Neha Kulkarni', area: 'Satara', category: 'Daily Essentials', phone: '' }
];

class NeedyPerson {
  static getAll() {
    return needyPeople;
  }

  static findById(id) {
    return needyPeople.find(p => p.id === id);
  }

  static generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}

module.exports = NeedyPerson;
