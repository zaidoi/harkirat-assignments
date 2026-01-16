const express = require("express");

const app = express();
app.use(express.json());
const users = [
  {
    name: "Zaid",
    kidneys: [
      {
        healthy: true,
      },
      {
        healthy: false,
      },
    ],
  },
];

app.get("/", (req, res) => {
  const zaidKidney = users[0].kidneys;
  const numberOfKidneys = zaidKidney.length;
  const numberOfHealthyKidneys = zaidKidney.filter(
    (kidney) => kidney.healthy == true
  ).length;
  const numberOfUnhealthyKidneys = zaidKidney.filter(
    (kidney) => kidney.healthy !== true
  ).length;
  res.json({
    numberOfKidneys,
    numberOfHealthyKidneys,
    numberOfUnhealthyKidneys,
  });
});

app.post("/", (req, res) => {
  const isHealthy = req.body.isHealthy;
  users[0].kidneys.push({
    healthy: isHealthy,
  });
  res.json({
    msg: "Done!",
  });
});

app.put("/", (req, res) => {
  if (isthereHealthyKidney()) {
    for (let i = 0; i < users[0].kidneys.length; i++) {
      users[0].kidneys[i].healthy = true;
    }
    res.json({});
  } else {
    res.status(411).json({
      msg: "Bro You already have healthy kidneys",
    });
  }
});

app.delete("/", (req, res) => {
  if (isThereUnhealthyKidney()) {
    const filterkidney = users[0].kidneys.filter(
      (kidney) => kidney.healthy !== false
    );
    users[0].kidneys = filterkidney;
    res.json({
      msg: "deleted",
    });
  } else {
    res.status(411).json({
      msg: "No Bad Kidneys outthere",
    });
  }
});

function isThereUnhealthyKidney() {
  let unhealthyKidney = false;
  for (let i = 0; i < users[0].kidneys.length; i++) {
    if (!users[0].kidneys[i].healthy) {
      unhealthyKidney = true;
    }
  }
  return unhealthyKidney;
}
function isthereHealthyKidney() {
  let healthyKidneys = false;
  for (let i = 0; i < users[0].kidneys.length; i++) {
    if (!users[0].kidneys[i].healthy) {
      healthyKidneys = true;
    }
  }
  return healthyKidneys;
}
app.listen(3000);
