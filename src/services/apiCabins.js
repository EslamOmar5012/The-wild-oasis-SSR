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

export const createEditCabin = async (newCabin, id) => {
  try {
    const hasImagePath = typeof newCabin.image === "string";

    const imageName = `${Math.random()}-${newCabin.image.name}`.replaceAll(
      "/",
      ""
    );

    const imagePath = hasImagePath
      ? newCabin.image
      : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

    //1. create cabin
    let query = supabase.from("cabins");

    //A) Create
    if (!id) query = query.insert([{ ...newCabin, image: imagePath }]);

    //B) Edit
    if (id)
      query = query.update({ ...newCabin, image: imagePath }).eq("id", id);

    const { data, error } = await query.select().single();

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

export const deleteCabin = async ({ id, image }) => {
  try {
    //1. delete cabin
    const { error } = await supabase.from("cabins").delete().eq("id", +id);
    if (error) throw new Error(error.message);

    //2. delete cabin image
    const { error: storageError } = await supabase.storage
      .from("cabin-images")
      .remove([image]);

    console.log(id, image);

    if (storageError) {
      throw new Error("cant delete cabin image");
    }
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};
