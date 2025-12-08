import { supabase } from "./supabase";

export const getCabins = async () => {
  try {
    let { data, error } = await supabase.from("cabins").select("*");
    if (error) throw new Error("Cabins could not be loaded");

    return data;
  } catch (err) {
    console.error(err.message);
  }
};
