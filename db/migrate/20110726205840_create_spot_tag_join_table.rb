class CreateSpotTagJoinTable < ActiveRecord::Migration
  def self.up
    create_table :spots_tags, :id => false do |t|
      t.integer :spot_id
      t.integer :tag_id
    end
  end

  def self.down
    drop_table :spots_tags
  end
end