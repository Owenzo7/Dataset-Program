# Dataset-Program
Task From BlueSaturn

1. To generate the mock dataset, we can use a function that creates a random DataMessage object with the given parameters and random values. We can also generate a list of unique authorIds and use them to assign authors to the messages randomly.

```js,
// Generate a random integer between min and max (inclusive)
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Generate a random string of length len
function randomString(len) {
  let result = '';
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Generate a random DataMessage object
function generateDataMessage(id, authorIds, channelIds) {
  const timestamp = new Date(Date.now() - randomInt(0, 60*24*60*60*1000)).toISOString();
  const authorId = authorIds[randomInt(0, authorIds.length - 1)];
  const channelId = channelIds[randomInt(0, channelIds.length - 1)];
  return {
    ID: id,
    Content: randomString(randomInt(10, 100)),
    Timestamp: timestamp,
    AuthorId: authorId,
    ChannelId: channelId,
  };
}

// Generate a mock dataset of DataMessage objects
function generateMockDataset(numMessages, numAuthors, numChannels) {
  const authorIds = [];
  for (let i = 0; i < numAuthors; i++) {
    authorIds.push(`author${i}`);
  }
  const channelIds = [];
  for (let i = 0; i < numChannels; i++) {
    channelIds.push(`channel${i}`);
  }
  const messages = [];
  for (let i = 0; i < numMessages; i++) {
    messages.push(generateDataMessage(i, authorIds, channelIds));
  }
  return messages;
}

```

The time complexity of generating the mock dataset is O(numMessages x numAuthors x numChannels x message generation time).

2. To calculate the quality score for each author, we can iterate over the messages and group them by author. For each author, we can count the number of messages, calculate the average frequency of messages, and calculate a content score based on the diversity of messages.

```js,
// Calculate the quality score for each author in the dataset
function calculateQualityScores(messages) {
  const authorGroups = {};
  // Group messages by author
  messages.forEach((message) => {
    if (!authorGroups[message.AuthorId]) {
      authorGroups[message.AuthorId] = [];
    }
    authorGroups[message.AuthorId].push(message);
  });
  const authorScores = {};
  // Calculate quality score for each author
  Object.keys(authorGroups).forEach((authorId) => {
    const messages = authorGroups[authorId];
    const numMessages = messages.length;
    const earliestTimestamp = new Date(messages[numMessages - 1].Timestamp);
    const latestTimestamp = new Date(messages[0].Timestamp);
    const timeDiff = latestTimestamp - earliestTimestamp;
    const numDays = timeDiff / (24*60*60*1000);
    const frequency = numMessages / numDays;
    const contentSet = new Set();
    messages.forEach((message) => {
      contentSet.add(message.Content);
    });
    const contentScore = contentSet.size / numMessages;
    const score = numMessages * frequency * contentScore;
    authorScores[authorId] = score;
  });
  return authorScores;
}

```
The time complexity of calculating the quality scores for each author is O(numMessages x numAuthors).

3. To calculate the overall quality score of the dataset, we can first calculate the quality scores for each author using the calculateQualityScores() function, and then calculate a weighted average of the individual scores.

```js,
// Calculate the overall quality score of the dataset
function calculateOverallQualityScore(messages) {
  const authorScores = calculateQualityScores(messages);
  let totalScore = 0;
  let totalNumMessages = 0;
  // Calculate weighted average of individual scores
  Object.keys(authorScores).forEach((authorId) => {
    const score = authorScores[authorId];
    const numMessages = messages.filter((message) => message.AuthorId === authorId).length;
    totalScore += score * numMessages;
    totalNumMessages += numMessages;
  });
  const overallScore = totalScore / totalNumMessages;
  return overallScore;
}


```

The time complexity of calculating the overall quality score of the dataset is O(numMessages x numAuthors).

4. To generate the mock dataset and calculate the quality scores and overall score, we can call these functions as follows:

```js,
const messages = generateMockDataset(200000, 200, 10);
const authorScores = calculateQualityScores(messages);
const overallScore = calculateOverallQualityScore(messages);
console.log(authorScores);
console.log(overallScore);


```


This code has a time complexity of O(numMessages x numAuthors x numChannels x message generation time + numMessages x numAuthors + numMessages x numAuthors). However, since the number of messages is much larger than the number of authors and channels, we can simplify this to O(numMessages x message generation time + numMessages).




