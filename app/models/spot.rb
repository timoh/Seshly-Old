class Spot < ActiveRecord::Base
  
  def self.getCategories  
    categories = []  
    for spot in self.all
      categories << spot.category
    end
    
    return categories
  end
  
  def self.getAreas  
    areas = []  
    for spot in self.all
      areas << spot.area
    end
    
    return areas
  end
  
  
end
