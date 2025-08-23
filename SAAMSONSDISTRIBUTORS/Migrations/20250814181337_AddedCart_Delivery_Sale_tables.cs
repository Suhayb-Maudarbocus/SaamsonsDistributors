using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SAAMSONSDISTRIBUTORS.Migrations
{
    /// <inheritdoc />
    public partial class AddedCart_Delivery_Sale_tables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ClientId",
                table: "Carts",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedDate",
                table: "Carts",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<decimal>(
                name: "DiscountPerProduct",
                table: "Carts",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<string>(
                name: "InvoiceNumber",
                table: "Carts",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "PercentageDiscount",
                table: "Carts",
                type: "decimal(5,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "Carts",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<decimal>(
                name: "TotalDiscount",
                table: "Carts",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "UnitPriceAtTime",
                table: "Carts",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ClientId",
                table: "Carts");

            migrationBuilder.DropColumn(
                name: "CreatedDate",
                table: "Carts");

            migrationBuilder.DropColumn(
                name: "DiscountPerProduct",
                table: "Carts");

            migrationBuilder.DropColumn(
                name: "InvoiceNumber",
                table: "Carts");

            migrationBuilder.DropColumn(
                name: "PercentageDiscount",
                table: "Carts");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "Carts");

            migrationBuilder.DropColumn(
                name: "TotalDiscount",
                table: "Carts");

            migrationBuilder.DropColumn(
                name: "UnitPriceAtTime",
                table: "Carts");
        }
    }
}
