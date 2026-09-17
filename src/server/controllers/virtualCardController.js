const VirtualCard = require('../models/VirtualCard');
const Account = require('../models/Account');

exports.getCard = async (req, res) => {
  try {
    const { account_number } = req.query;

    if (!account_number) {
      return res.status(400).json({ message: 'Account number is required' });
    }

    let card = await VirtualCard.findOne({ accountNumber: account_number });

    if (!card) {
      // If no card exists, try to find the account and create one
      const account = await Account.findOne({ accountNumber: account_number });
      if (!account) {
        return res.status(404).json({ message: 'Account not found' });
      }

      const cardNum = '4' + Math.floor(1000000000005000 + Math.random() * 8999999999999000).toString().replace(/(.{4})/g, '$1 ').trim();
      card = await VirtualCard.create({
        accountNumber: account_number,
        cardNumber: cardNum,
        cardHolderName: `${account.fname.toUpperCase()} ${account.surname.toUpperCase()}`,
        pin: '1234',
        cvv: '888',
        expiryDate: '12/29',
        status: 'Active',
      });
    }

    res.json({ card });
  } catch (error) {
    console.error('Get Virtual Card Error:', error);
    res.status(500).json({ message: 'Server error fetching card details' });
  }
};

exports.updateCardStatus = async (req, res) => {
  try {
    const { account_number, service } = req.body;

    if (!account_number || !service) {
      return res.status(400).json({ message: 'Account number and service action are required' });
    }

    const card = await VirtualCard.findOne({ accountNumber: account_number });
    if (!card) {
      return res.status(404).json({ message: 'Virtual Card not found for this account' });
    }

    if (service === 'block_card') {
      card.status = 'Blocked';
    } else if (service === 'activate_card') {
      card.status = 'Active';
    }

    await card.save();

    res.json({
      message: `Card status successfully set to ${card.status}`,
      card,
    });
  } catch (error) {
    console.error('Update Virtual Card Error:', error);
    res.status(500).json({ message: 'Server error updating card status' });
  }
};

exports.changePin = async (req, res) => {
  try {
    const { account_number, old_pin, new_pin } = req.body;

    if (!account_number || !new_pin || new_pin.length !== 4) {
      return res.status(400).json({ message: 'Account number and a 4-digit PIN are required.' });
    }

    const card = await VirtualCard.findOne({ accountNumber: account_number });
    if (!card) {
      return res.status(404).json({ message: 'Virtual card not found.' });
    }

    card.pin = new_pin;
    await card.save();

    res.json({ message: 'PIN updated successfully!', card });
  } catch (error) {
    console.error('Change PIN Error:', error);
    res.status(500).json({ message: 'Server error changing PIN' });
  }
};
