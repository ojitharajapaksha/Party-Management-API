const app = require('./app');
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`TMF632 Party API running on port ${PORT}`);
});