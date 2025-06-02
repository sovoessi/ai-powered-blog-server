import mongoose  from "mongoose";

const postSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Please provide a title"],
            minLength: 3,
            maxLength: 100,
        },
        description: {
            type: String,
            required: [true, "Please provide content"],
            minLength: 10,
        },
        category: {
            type: String,
            required: [true, "Please provide a category"],
            enum: ["Technology","Business", "Health", "Lifestyle", "Education", "Travel"],
        },
        image: {
            type: String,
            required: [true, "Please provide an image URL"],
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Please provide an author"],
        },
        isPublished: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);


postSchema.pre("save", function (next) {
    if (!this.isModified("content")) return next();
    this.content = this.content.trim();
    next();
});

const Post = mongoose.model("Post", postSchema);
export default Post;