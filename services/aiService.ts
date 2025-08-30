import { GiftIdea, Person } from '@/models/Person';

/**
 * Service for AI gift suggestions based on a person's preferences
 */

/**
 * Get AI gift suggestions for a specific person
 * 
 * In a real app, this would call an actual AI API like OpenAI
 * For demonstration purposes, we're simulating the AI response
 * 
 * @param person The person to get gift suggestions for
 * @param occasion Optional occasion for the gift
 * @param priceRange Optional price range for the gift
 * @returns Promise that resolves to an array of gift ideas
 */
export async function getAiGiftSuggestions(
  person: Person, 
  occasion?: string,
  priceRange?: { min: number; max: number }
): Promise<GiftIdea[]> {
  // This is a simulation of an AI API call
  // In a real app, you would make an actual API call to an AI service
  
  // Wait for a bit to simulate an API call
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Generate gift ideas based on the person's preferences
  const giftIdeas: GiftIdea[] = [];
  
  if (person.preferences) {
    // Map preferences to gift ideas
    if (person.preferences.includes('Books')) {
      giftIdeas.push({
        id: `ai-${Date.now()}-1`,
        name: 'Book Collection',
        description: 'Curated set of bestselling books based on their interests',
        price: 75,
        occasion: occasion || 'any',
        isAiSuggested: true
      });
    }
    
    if (person.preferences.includes('Hiking')) {
      giftIdeas.push({
        id: `ai-${Date.now()}-2`,
        name: 'Hiking Backpack',
        description: 'Lightweight, water-resistant backpack with hydration system',
        price: 120,
        occasion: occasion || 'any',
        isAiSuggested: true
      });
    }
    
    if (person.preferences.includes('Photography')) {
      giftIdeas.push({
        id: `ai-${Date.now()}-3`,
        name: 'Camera Lens Filters',
        description: 'Professional photography lens filter kit',
        price: 85,
        occasion: occasion || 'any',
        isAiSuggested: true
      });
    }
    
    if (person.preferences.includes('Gardening')) {
      giftIdeas.push({
        id: `ai-${Date.now()}-4`,
        name: 'Rare Plant Collection',
        description: 'Set of exotic plants for their garden',
        price: 65,
        occasion: occasion || 'any',
        isAiSuggested: true
      });
    }
    
    if (person.preferences.includes('Cooking')) {
      giftIdeas.push({
        id: `ai-${Date.now()}-5`,
        name: 'Gourmet Spice Collection',
        description: 'Set of premium spices from around the world',
        price: 45,
        occasion: occasion || 'any',
        isAiSuggested: true
      });
    }
  }
  
  // Add some general gift ideas if we don't have enough based on preferences
  if (giftIdeas.length < 3) {
    giftIdeas.push({
      id: `ai-${Date.now()}-6`,
      name: 'Personalized Calendar',
      description: 'Custom calendar with memorable photos',
      price: 35,
      occasion: 'birthday',
      isAiSuggested: true
    });
    
    giftIdeas.push({
      id: `ai-${Date.now()}-7`,
      name: 'Luxury Candle Set',
      description: 'Set of scented candles for relaxation',
      price: 50,
      occasion: 'any',
      isAiSuggested: true
    });
  }
  
  // Filter by price range if provided
  let filteredIdeas = giftIdeas;
  if (priceRange) {
    filteredIdeas = giftIdeas.filter(
      idea => idea.price && idea.price >= priceRange.min && idea.price <= priceRange.max
    );
    
    // If we filtered out all ideas, add at least one that fits the budget
    if (filteredIdeas.length === 0) {
      filteredIdeas = [{
        id: `ai-${Date.now()}-8`,
        name: 'Gift Card',
        description: `Gift card for ${person.name}'s favorite store`,
        price: Math.floor((priceRange.min + priceRange.max) / 2),
        occasion: occasion || 'any',
        isAiSuggested: true
      }];
    }
  }
  
  return filteredIdeas;
}
