import { supabase, supabaseUrl } from "./supabase";

export const getCabins = async () => {
  try {
    const { data, error } = await supabase.from("cabins").select("*");
    if (error || !data)
      throw new Error(error.message || "Cabins could not be loaded");

    return data;
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};

export const createCabin = async (newCabin) => {
  try {
    const imageName = `${Math.random()}-${newCabin.image.name}`.replaceAll(
      "/",
      ""
    );

    const imagePath = `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;
    //1. create cabin
    const { data, error } = await supabase
      .from("cabins")
      .insert([{ ...newCabin, image: imagePath }])
      .select();
    if (error || !data)
      throw new Error(error.message || "Can't create a new Cabin");

    //2. upload image
    const { error: storageError } = await supabase.storage
      .from("cabin-images")
      .upload(imageName, newCabin.image);

    //3 delete a cabin if there was an error

    if (storageError) {
      await supabase.from("cabins").delete().eq("id", data.id);
      throw new Error(
        "cabin image could not be uploaded and the cabin was not created"
      );
    }
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};

export const deleteCabin = async (id) => {
  try {
    const { error } = await supabase.from("cabins").delete().eq("id", +id);
    if (error) throw new Error(error.message);
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};
