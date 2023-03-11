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

  
  