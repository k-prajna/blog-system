import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { User } from '../models/User';
import { Post } from '../models/Post';
import { Comment } from '../models/Comment';

dotenv.config();

const users = [
  {
    name: 'Alice Johnson',
    email: 'alice@example.com',
    password: 'password123',
    role: 'admin' as const,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
  },
  {
    name: 'Bob Smith',
    email: 'bob@example.com',
    password: 'password123',
    role: 'user' as const,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
  },
  {
    name: 'Carol Williams',
    email: 'carol@example.com',
    password: 'password123',
    role: 'user' as const,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carol',
  },
];

const postsData = [
  {
    title: 'Getting Started with Modern Web Development',
    content: `Modern web development has evolved tremendously over the past decade. From the early days of jQuery to the sophisticated frameworks we use today, the landscape continues to change rapidly.

In this article, we'll explore the fundamental concepts that every developer should understand: component-based architecture, reactive state management, and the importance of type safety.

React, Vue, and Svelte have popularized the component model, making UI development more modular and maintainable. TypeScript has become the de-facto standard for large applications, providing compile-time safety that reduces bugs in production.

Whether you're building a simple blog or a complex SaaS application, understanding these principles will set you up for success.`,
    excerpt: 'Explore the fundamental concepts of modern web development including components, state management, and TypeScript.',
    coverImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
    category: 'Technology',
    tags: ['webdev', 'react', 'typescript', 'javascript'],
  },
  {
    title: 'The Art of Minimalist Living',
    content: `Minimalism isn't just about having fewer possessions—it's a mindset that prioritizes intentionality in every aspect of life.

By decluttering our physical spaces, we often find mental clarity follows. The process begins with asking a simple question about each item: Does this add value to my life?

Many people who adopt minimalist principles report reduced stress, better focus, and a greater appreciation for experiences over things. Start small: clear one drawer, one shelf, or one digital folder. The momentum builds quickly.

Remember, minimalism looks different for everyone. The goal isn't emptiness—it's creating space for what truly matters.`,
    excerpt: 'Discover how embracing minimalism can reduce stress and create space for what truly matters in life.',
    coverImage: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=800',
    category: 'Lifestyle',
    tags: ['minimalism', 'lifestyle', 'mindfulness'],
  },
  {
    title: 'Hidden Gems of Southeast Asia',
    content: `Beyond the well-trodden paths of Bangkok and Bali lie destinations that still retain their authentic charm.

In northern Laos, the slow boat from Huay Xai to Luang Prabang offers one of the most peaceful journeys in Asia. Villages along the Mekong still live much as they have for generations.

The rice terraces of Batad in the Philippines remain relatively untouched compared to their more famous counterparts in Indonesia. Hiking between villages rewards travelers with warm hospitality and stunning views.

Responsible tourism is key. Support local businesses, respect cultural norms, and leave only footprints. These places remain special precisely because they haven't been overwhelmed by mass tourism—yet.`,
    excerpt: 'Explore lesser-known destinations in Southeast Asia that offer authentic experiences away from the crowds.',
    coverImage: 'https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?w=800',
    category: 'Travel',
    tags: ['travel', 'asia', 'adventure'],
  },
  {
    title: 'Building a Sustainable Morning Routine',
    content: `Your morning sets the tone for the entire day. A well-designed routine can boost productivity, improve mental health, and create a sense of control.

The most effective routines share common elements: hydration, movement, mindfulness, and intentional planning. However, the specific activities should match your personality and goals.

Avoid the trap of copying someone else's perfect 5 AM routine. If you're not a morning person, forcing an early start may backfire. Instead, design a sequence that feels natural and sustainable.

Start with just two or three anchors—perhaps a glass of water, a short walk, and reviewing your top three priorities. Consistency matters more than complexity.`,
    excerpt: 'Learn how to design a morning routine that actually sticks and improves your daily productivity.',
    coverImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800',
    category: 'Health',
    tags: ['productivity', 'habits', 'wellness'],
  },
  {
    title: 'Understanding TypeScript Generics',
    content: `Generics are one of TypeScript's most powerful features, yet they often confuse developers coming from JavaScript.

At their core, generics allow you to write reusable code that works with multiple types while preserving type information. Think of them as variables for types.

A simple example is a function that returns the first element of an array. Without generics, you'd lose type information. With generics, the return type correctly reflects the input array's element type.

Advanced patterns include constrained generics, default type parameters, and mapped types. Mastering these concepts unlocks the ability to build highly flexible and type-safe libraries and applications.

Practice by converting existing utility functions to use generics—you'll quickly develop an intuition for when and how to apply them.`,
    excerpt: 'A practical guide to TypeScript generics with real-world examples and advanced patterns.',
    coverImage: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800',
    category: 'Technology',
    tags: ['typescript', 'programming', 'webdev'],
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const createdUsers = await User.create(users);
    console.log(`Created ${createdUsers.length} users`);

    // Create posts
    const posts = [];
    for (let i = 0; i < postsData.length; i++) {
      const author = createdUsers[i % createdUsers.length];
      const post = await Post.create({
        ...postsData[i],
        author: author._id,
        views: Math.floor(Math.random() * 500) + 50,
      });
      posts.push(post);
    }
    console.log(`Created ${posts.length} posts`);

    // Create comments
    const comments = [
      { content: 'Great article! Really helped me understand the concepts better.', postIndex: 0, userIndex: 1 },
      { content: 'Looking forward to more content like this.', postIndex: 0, userIndex: 2 },
      { content: 'Minimalism changed my life. Thanks for sharing.', postIndex: 1, userIndex: 0 },
      { content: 'I visited Laos last year and the slow boat was unforgettable!', postIndex: 2, userIndex: 1 },
      { content: 'Solid advice on building sustainable habits.', postIndex: 3, userIndex: 2 },
      { content: 'Generics finally clicked for me after reading this.', postIndex: 4, userIndex: 0 },
      { content: 'Would love a follow-up on advanced mapped types.', postIndex: 4, userIndex: 1 },
    ];

    for (const c of comments) {
      await Comment.create({
        content: c.content,
        author: createdUsers[c.userIndex]._id,
        post: posts[c.postIndex]._id,
      });
    }
    console.log(`Created ${comments.length} comments`);

    console.log('\n✅ Seed completed successfully!');
    console.log('\nSample credentials:');
    console.log('  Admin: alice@example.com / password123');
    console.log('  User:  bob@example.com / password123');
    console.log('  User:  carol@example.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();
