import mongoose from 'mongoose';
import app from "./index";

const port = process.env.PORT
const mongourl = process.env.MONGOURL as string

mongoose.connect(mongourl, {})
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
      console.log('Server is running on port ' + port);
    })
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB', error);
  })
