import { Punch } from "@/model/punch.modle";

// punch in api
export const punchIn = async (req) => {
  try {
    const { userId, date, PunchIntime, latitude, longitude } = await req.json();

    // Convert latitude/longitude to numbers
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    // Validation
    if (!userId || !date || !PunchIntime || isNaN(lat) || isNaN(lon)) {
      return new Response(
        JSON.stringify({
          error: "All fields are required and must be valid numbers",
        }),
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
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
};

// ✅ PUNCH OUT (using PUT)
export const punchOut = async (req) => {
  try {
    const { userId, date, PunchOuttime } = await req.json(); // match schema field exactly!

    if (!userId || !date || !PunchOuttime) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        {
          status: 400,
        }
      );
    }

    // Find and update the record
    const updatedPunch = await Punch.findOneAndUpdate(
      { userId, date },
      { PunchOuttime }, // update field
      { new: true } // return updated document
    );

    if (!updatedPunch) {
      return new Response(
        JSON.stringify({ error: "Punch in not found for today" }),
        {
          status: 404,
        }
      );
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
    const _id = searchParams.get("_id");
    const date = searchParams.get("date");

    if (!_id || !date) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        { status: 400 }
      );
    }

    const punches = await Punch.find({ _id, date }).sort({ PunchIntime: 1 });

    if (punches.length === 0) {
      return new Response(JSON.stringify({ error: "No punch records found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ punches }), { status: 200 });
  } catch (error) {
    console.error("Error in getPunchRecords API:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
};

// report to get all punch records (report)
export const getAllPunchRecord = async (req) => {
  try {
    const { searchParams } = new URL(req.url);

    // Required filters
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (!startDate || !endDate) {
      return new Response(
        JSON.stringify({ error: "startDate and endDate are required" }),
        { status: 400 }
      );
    }

    // Pagination + Search
    let page = parseInt(searchParams.get("page")) || 1;
    let limit = parseInt(searchParams.get("limit")) || 10;
    const search = searchParams.get("search") || "";

    if (page < 1) page = 1;

    const MAX_LIMIT = 100;
    limit = Math.min(limit, MAX_LIMIT);

    const skip = (page - 1) * limit;

    // 1️⃣ Get all punch records for date range
    const punches = await Punch.find({
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    })
      .populate("userId", "-password -__v") // Full user details without password
      .lean();

    // 2️⃣ Apply search on user data (name or email)
    const filteredPunches = punches.filter((p) => {
      if (!search) return true;

      if (!p.userId) return false;

      const userText = `${p.userId.name} ${p.userId.email}`.toLowerCase();
      return userText.includes(search.toLowerCase());
    });

    // 3️⃣ Pagination on filtered items
    const totalItems = filteredPunches.length;
    const totalPages = Math.ceil(totalItems / limit);

    const paginatedData = filteredPunches.slice(skip, skip + limit);

    // Final Response
    return new Response(
      JSON.stringify({
        message: "Punch records fetched successfully",
        currentPage: page,
        totalPages,
        totalItems,
        perPage: limit,
        punches: paginatedData,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in getAllPunchRecord API:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
};

