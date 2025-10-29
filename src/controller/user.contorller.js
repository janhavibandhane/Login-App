import { Punch } from "@/model/punch.modle";

// punch in api
export const punchIn = async (req) => {
  try {
    const { userId, date, PunchIntime, latitude, longitude } = await req.json();

    // Convert latitude/longitude to numbers
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    // Validation
    if (
      !userId ||
      !date ||
      !PunchIntime ||
      isNaN(lat) ||
      isNaN(lon)
    ) {
      return new Response(
        JSON.stringify({ error: "All fields are required and must be valid numbers" }),
        { status: 400 }
      );
    }

    const newPunch = await Punch.create({
      userId,
      date,
      PunchIntime,
      latitude: lat,
      longitude: lon,
    });

    return new Response(
      JSON.stringify({
        message: "Punch in recorded successfully",
        punch: newPunch,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in punchIn api", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
};


// ✅ PUNCH OUT (using PUT)
export const punchOut = async (req) => {
  try {
    const { userId, date, PunchOuttime } = await req.json(); // match schema field exactly!

    if (!userId || !date || !PunchOuttime) {
      return new Response(JSON.stringify({ error: "All fields are required" }), {
        status: 400,
      });
    }

    // Find and update the record
    const updatedPunch = await Punch.findOneAndUpdate(
      { userId, date },
      { PunchOuttime }, // update field
      { new: true } // return updated document
    );

    if (!updatedPunch) {
      return new Response(JSON.stringify({ error: "Punch in not found for today" }), {
        status: 404,
      });
    }

    return new Response(
      JSON.stringify({
        message: "Punch out recorded successfully",
        punch: updatedPunch,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in punchOut API:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
};

// ✅ GET PUNCH RECORDS
export const getPunchRecords = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const date = searchParams.get("date");

    if (!userId || !date) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        { status: 400 }
      );
    }

    const punches = await Punch.find({ userId, date }).sort({ PunchIntime: 1 });

    if (punches.length === 0) {
      return new Response(
        JSON.stringify({ error: "No punch records found" }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify({ punches }), { status: 200 });
  } catch (error) {
    console.error("Error in getPunchRecords API:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
};

